"use client";

import useHttpRequest from "@/src/hooks/use-fetch";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type MemberDto = {
  firstName: string;
  lastName: string;
  address: string;
  ssn: string;
};

export default function Home() {
  const [members, setMembers] = useState<MemberDto[]>([]);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MemberDto>({
    defaultValues: {
      address: "",
      firstName: "",
      lastName: "",
      ssn: "",
    },
  });

  const { request: fetchMembersData, response: membersPayload } =
    useHttpRequest("http://localhost:8081/api/members", { requiresAuth: true });

  const { request: createMember, response: createMemberPayload } =
    useHttpRequest("http://localhost:8081/api/members", {
      requiresAuth: true,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

  // Initial data fetching. Looks for DB members. This is only executed once.
  useEffect(() => {
    fetchMembersData().then((payload) => {
      setMembers(payload || []);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Form submition. Creates a new member and appends it to members state.
  const onSubmit = useCallback(
    async (data: MemberDto) => {
      const formattedMember = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        address: data.address.trim(),
        ssn: data.ssn.trim(),
      };

      await createMember(JSON.stringify(formattedMember));

      // Appends new member to local state
      if (!createMemberPayload.error) {
        setMembers((oldMembers) => [...oldMembers, formattedMember]);
      }
    },
    [createMember, createMemberPayload.error]
  );

  return (
    <Stack h="100vh" gap={0}>
      {/* Navigation */}
      <HStack justifyContent="space-between" p="4" bg="green.300">
        <Button>Home</Button>
        <Button>Other Page</Button>
      </HStack>

      {/* Main */}
      <HStack
        bg="blue.300"
        padding="8"
        justifyContent="center"
        spacing="10"
        flex={1}
      >
        {/* Form */}
        <VStack>
          <Controller
            name="firstName"
            control={control}
            rules={{
              required: {
                value: true,
                message: "First name is required",
              },
              minLength: { value: 1, message: "First name is required" },
            }}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.firstName}>
                <Input {...field} placeholder="First Name" />
                <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="lastName"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Last name is required",
              },
              minLength: { value: 1, message: "Last name is required" },
            }}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.lastName}>
                <Input {...field} placeholder="Last Name" />
                <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="address"
            control={control}
            rules={{
              required: {
                value: true,
                message: "Address is required",
              },
              minLength: { value: 1, message: "Address is required" },
            }}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.address}>
                <Input {...field} placeholder="Address" />
                <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="ssn"
            control={control}
            rules={{
              required: {
                value: true,
                message: "SSN is required",
              },
              pattern: {
                value: new RegExp(/^\d{3}-\d{2}-\d{4}$/),
                message: "SSN must be of type ###-##-####",
              },
              validate: (value) => {
                if (members.some(({ ssn }) => ssn === value.trim())) {
                  return "That SSN is taken!";
                }

                return true;
              },
            }}
            render={({ field }) => (
              <FormControl isInvalid={!!errors.ssn}>
                <Input {...field} placeholder="ssn" />
                <FormErrorMessage>{errors.ssn?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <HStack w="100%">
            <Button
              flex={1}
              onClick={() =>
                reset({ address: "", firstName: "", lastName: "", ssn: "" })
              }
            >
              Reset
            </Button>
            <Button
              flex={1}
              type="submit"
              onClick={handleSubmit(onSubmit)}
              isLoading={createMemberPayload.isLoading}
            >
              Save
            </Button>
          </HStack>
        </VStack>
        {/* List */}
        <VStack>
          {membersPayload.isLoading ? (
            <Spinner />
          ) : (
            <TableContainer h="100%">
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>First Name</Th>
                    <Th>Last Name</Th>
                    <Th>Address</Th>
                    <Th>SSN</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {members.map((member) => (
                    <Tr key={member.ssn}>
                      <Td>{member.firstName}</Td>
                      <Td>{member.lastName}</Td>
                      <Td>{member.address}</Td>
                      <Td>{member.ssn}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </VStack>
      </HStack>

      {/* Footer */}
      <HStack bg="red.300" justifyContent="space-between" p={4}>
        <Text>Copyright</Text>
        <Text>All Rights Reserved</Text>
      </HStack>
    </Stack>
  );
}
